const router = require("express").Router();

const { Create, Read, Patch, Update } = require("../Controller/Scheme/Crud");

const List = require("./../Controller/Scheme/List");
const ListMultiModel = require("./../Controller/Scheme/ListMultiModel");

const Search = require("./../Controller/Scheme/Search");

const Relax = require("./../Controller/Scheme/Relax");

const Csv = require("./../Controller/Scheme/Csv");

const PdfGen = require("./../Controller/Scheme/Pdf");

const PostMan = require("./../Controller/Scheme/Postman");

const MulterMultiFiles = require("./../Middleware/Multer/multerMultiFiles");
const MulterSingleFile = require("./../Middleware/Multer/multerSingleFile");

// 🟢 LISTING
router.get("/list-multi", ListMultiModel); // Specific first
router.get("/list/:model", List);

// 🔍 SEARCH
router.get("/fuse-search/:model", Search.FuseSearch);

// 🗃️ FILE ENGINE (CouchDB)
router.get("/relax/read", Relax.Read);
router.put("/relax/multi/:model", MulterMultiFiles, Relax.Upsert);

// 📊 CSV ROUTES
router.get("/csv/template/:model", Csv.Template); // Specific first
router.get("/csv/generate/:model", Csv.Generate);
router.put("/csv/upload/:model", MulterSingleFile, Csv.Upload);

// 📄 PDF GENERATION
router.get("/pdf/generate/:model", PdfGen);

// 🧪 POSTMAN SCHEMA GENERATION
router.get("/postman/generate", PostMan);

// ✏️ CRUD Generic
router.post("/:model", Create);
router.patch("/:model", Patch);
router.put("/:model", Update);
router.get("/:model", Read);

module.exports = router;
