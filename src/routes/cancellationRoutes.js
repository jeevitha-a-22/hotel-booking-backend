const r=require("express").Router(),p=require("../middleware/auth"),c=require("../controllers/cancellationController");r.put("/:id",p,c.cancelWithPolicy);module.exports=r;
