const getModel = require("./../Utils/CLI/getModel");

const genBody = require("./../Utils/Scheme/genBody");

const TransForge = require("./../Utils/Scheme/TransForge");

const prisma = require("../../Prisma");

const {
  handleAfterPermission,
  handleBeforePermission,
} = require("./../Utils/Scheme/Permission");

async function Create(req, res, next) {
  try {
    // code here

    const { model } = req.params;

    const body = req.body;

    const modelDoc = getModel(model);

    const { field, permission } = modelDoc;

    if (!field) {
      throw {
        custom: true,
        message: "Model not supported for Scheme",
        status: 500,
      };
    }

    const allowedMethods = Array.isArray(permission?.allowedMethods)
      ? permission?.allowedMethods
      : ["POST"];

    if (!allowedMethods?.includes("POST")) {
      throw { custom: true, message: "Model permision ", status: 403 };
    }

    await handleBeforePermission({ req, permission });

    const data = genBody({ body, field });

    await TransForge({
      field,
      model,
      body: data,
      req,
      excludeInValidation: ["id"],
    });

    const doc = await prisma[model].create({
      data: data,
    });

    await handleAfterPermission({ req, permission, data: doc });

    return res.status(200).json({ _message: "Created succefully", ...doc });
  } catch (e) {
    console.log(e);
    next(e);
  }
}

module.exports = Create;
