const Booking = require("../models/Booking");
const RoomType = require("../models/RoomType");
const Hotel = require("../models/Hotel");
const { canTransition } = require("../utils/bookingStatus");
const price = require("../utils/calculatePrice");

exports.createBooking = async (req, res, next) => {
  try {
    const {
      hotelId,
      roomTypeId,
      checkIn,
      checkOut,
      guests
    } = req.body;

    const a = new Date(checkIn);
    const b = new Date(checkOut);

    if (isNaN(a.getTime()) || isNaN(b.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid check-in or check-out date"
      });
    }

    if (a >= b) {
      return res.status(400).json({
        success: false,
        message: "checkOut must be after checkIn"
      });
    }

    if (!Number.isInteger(guests) || guests < 1) {
      return res.status(400).json({
        success: false,
        message: "Guests must be at least 1"
      });
    }

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: "Hotel not found"
      });
    }

    const r = await RoomType.findOne({
      _id: roomTypeId,
      hotelId
    });

    if (!r) {
      return res.status(404).json({
        success: false,
        message: "Room type not found"
      });
    }

    if (guests > r.capacity) {
      return res.status(400).json({
        success: false,
        message: "Guest count exceeds capacity"
      });
    }

    const n = await Booking.countDocuments({
      roomTypeId,
      status: {
        $in: ["Reserved", "Confirmed", "Checked-in"]
      },
      checkIn: {
        $lt: b
      },
      checkOut: {
        $gt: a
      }
    });

    if (n >= r.totalRooms) {
      return res.status(409).json({
        success: false,
        message: "No rooms available"
      });
    }

    const pricing = await price({
      roomType: r,
      checkIn,
      checkOut
    });

    const booking = await Booking.create({
      guestId: req.user._id,
      hotelId,
      roomTypeId,
      checkIn: a,
      checkOut: b,
      guests,
      status: "Reserved",
      ...pricing
    });

    res.status(201).json({
      success: true,
      booking
    });
  } catch (e) {
    next(e);
  }
};

exports.getMyBookings = async (req, res, next) => {
  try {
    const b = await Booking.find({
      guestId: req.user._id
    })
      .populate("hotelId", "name city")
      .populate("roomTypeId", "name basePrice")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: b.length,
      bookings: b
    });
  } catch (e) {
    next(e);
  }
};

exports.getBookingById = async (req, res, next) => {
  try {
    const b = await Booking.findById(req.params.id)
      .populate("guestId", "name email")
      .populate("hotelId", "name city")
      .populate("roomTypeId", "name basePrice capacity");

    if (!b) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    if (
      b.guestId._id.toString() !== req.user._id.toString() &&
      !["admin", "staff", "hotelOwner"].includes(req.user.role)
    ) {
      return res.status(403).json({
        success: false,
        message: "Not allowed"
      });
    }

    res.json({
      success: true,
      booking: b
    });
  } catch (e) {
    next(e);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const b = await Booking.findById(req.params.id);

    if (!b) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    if (req.user.role === "hotelOwner") {
      const hotel = await Hotel.findById(b.hotelId);
      if (!hotel || hotel.ownerId.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: "Not allowed for this hotel"
        });
      }
    }

    if (!canTransition(b.status, req.body.status)) {
      return res.status(409).json({
        success: false,
        message: `Invalid transition: ${b.status} -> ${req.body.status}`
      });
    }

    b.status = req.body.status;
    if (req.body.status === "Checked-in") b.actualCheckIn = new Date();
    if (req.body.status === "Checked-out") b.actualCheckOut = new Date();

    await b.save();

    res.json({
      success: true,
      booking: b
    });
  } catch (e) {
    next(e);
  }
};

exports.cancelBooking = async (req, res, next) => {
  try {
    const b = await Booking.findById(req.params.id);

    if (!b) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    if (!canTransition(b.status, "Cancelled")) {
      return res.status(409).json({
        success: false,
        message: "Booking cannot be cancelled"
      });
    }

    if (
      b.guestId.toString() !== req.user._id.toString() &&
      !["admin", "staff", "hotelOwner"].includes(req.user.role)
    ) {
      return res.status(403).json({
        success: false,
        message: "Not allowed"
      });
    }

    if (req.user.role === "hotelOwner") {
      const hotel = await Hotel.findById(b.hotelId);
      if (!hotel || hotel.ownerId.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: "Not allowed for this hotel"
        });
      }
    }

    const d =
      (new Date(b.checkIn) - new Date()) / 86400000;

    const rate =
      d >= 7
        ? 1
        : d >= 2
          ? 0.5
          : 0;

    b.status = "Cancelled";
    b.cancellationRefund = +(
      b.totalAmount * rate
    ).toFixed(2);

    await b.save();

    res.json({
      success: true,
      refundPercentage: rate * 100,
      booking: b
    });
  } catch (e) {
    next(e);
  }
};