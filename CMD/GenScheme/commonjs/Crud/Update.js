const prisma = require("../../Prisma");

const getModel = require("./../Utils/CLI/getModel");

const TransForge = require("./../Utils/Scheme/TransForge");

const CreateReq = require("./Create");

const PatchReq = require("./Patch");

async function Update(req, res, next) {
  try {
    // code here

    const { model } = req.params;
    const body = req?.body;
    const id = body?.id;

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
      : ["PUT"];

    if (!allowedMethods?.includes("PATCH")) {
      throw { custom: true, message: "Model Patch Forbiden ", status: 403 };
    }

    const excludeInValidation = ["id"];

    let record = null;

    if (id) {
      record = await prisma[model].findUnique({
        where: {
          id,
        },
      });

      if (!record) {
        throw { custom: true, message: "Record with id doesn't  exist" };
      }
    }

    let data = {};

    for (let key of Object.keys(body)) {
      if (key === "id") {
        continue;
      }
      let fieldVal = field[key];
      let bodyVal = body[key];
      let recordVal = record ? record[key] : null;
      if (fieldVal === undefined || bodyVal === undefined) {
        excludeInValidation.push(key);
        continue;
      }

      if (bodyVal === recordVal) {
        continue;
      }

      data[key] = bodyVal;
    }

    await TransForge({
      field,
      model,
      body: data,
      isPatch: true,
      excludeInValidation,
    });

    if (id) {
      data.id = id;
      req.body = data;
      PatchReq(req, res, next);
    } else {
      req.body = data;
      CreateReq(req, res, next);
    }
  } catch (e) {
    next(e);
  }
}

module.exports = Update;
