const prisma = require("../../Prisma");

const getModel = require("./../Utils/CLI/getModel");

const TransForge = require("./../Utils/Scheme/TransForge");

const {
  handleAfterPermission,
  handleBeforePermission,
} = require("./../Utils/Scheme/Permission");

async function Patch(req, res, next) {
  try {
    // code here

    const { model } = req.params;
    const body = req?.body;
    const id = body?.id;

    if (!id) {
      throw { custom: true, message: "Id is required" };
    }

    const date = new Date();
    const updated_at = date.toISOString();

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
      : ["PATCH"];

    if (!allowedMethods?.includes("PATCH")) {
      throw { custom: true, message: "Model Patch Forbiden ", status: 403 };
    }

    await handleBeforePermission({ req, permission });

    const transaction = await prisma.$transaction(
      async (tx) => {
        const excludeInValidation = ["id"];

        const record = await tx[model].findUnique({
          where: {
            id,
          },
        });

        if (!record) {
          throw { custom: true, message: "Record with id doesn't  exist" };
        }

        let data = {};

        for (let key of Object.keys(body)) {
          if (key === "id") {
            continue;
          }
          let fieldVal = field[key];
          let bodyVal = body[key];
          let recordVal = record[key];
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

        // uncomment for auto updates
        if (field.updated_at) {
          data.updated_at = updated_at;
        }

        const updated = await prisma[model].update({
          where: {
            id,
          },
          data,
        });

        return updated;
      },
      { timeout: 60000000 }
    );

    await handleAfterPermission({ req, permission, data: transaction });

    return res.status(201).json({ _message: "Record updated", transaction });
  } catch (e) {
    next(e);
  }
}

module.exports = Patch;
