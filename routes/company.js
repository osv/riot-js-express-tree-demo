const company = require("../controllers/company.js"),
      express = require('express'),
      router = express.Router();

router.get('/', company.list);
router.put('/', company.create);
router.post('/', company.update);
router.delete('/:id', company.remove);

module.exports = router;
