const r=require("express").Router(),p=require("../middleware/auth"),c=require("../controllers/invoiceController");r.get("/:id",p,c.getInvoice);module.exports=r;
