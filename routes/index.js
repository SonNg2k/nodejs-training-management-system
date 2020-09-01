var router = require("express").Router()

// Verify login credentials
router.post("")

// Assemble other routes...
router.use("/assistant-management", require("./"))
router.use("/trainer-management", require("./"))
router.use("/trainee-management", require("./"))
router.use("/category-management", require("./"))
router.use("/program-management", require("./"))
router.use("/trainer", require("./"))
router.use("/trainee", require("./"))

module.exports = router
