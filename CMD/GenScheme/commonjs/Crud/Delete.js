const prisma = require("../../Prisma");

const getModel = require("./../Utils/CLI/getModel");

const {
  handleAfterPermission,
  handleBeforePermission,
} = require("./../Utils/Scheme/Permission");

async function Delete(req, res, next) {
  try {
    // code here

    const { model } = req.params;
    const { id } = req.query;

    if (!id) {
      throw { custom: true, message: "Id required" };
    }

    const modelDoc = getModel(model);

    const { permission } = modelDoc;

    const allowedMethods = Array.isArray(permission?.allowedMethods)
      ? permission?.allowedMethods
      : [];

    if (!allowedMethods?.includes("DELETE")) {
      throw { custom: true, message: "Model permision ", status: 403 };
    }

    await handleBeforePermission({ req, permission });

    const transaction = await prisma.$transaction(async (tx) => {
      const record = await prisma[model].findUnique({
        where: { id },
      });

      if (!record) {
        throw { custom: true, message: "Record to delete not found" };
      }

      const deleteRecord = await prisma[model].delete({
        where: { id },
      });

      return deleteRecord;
    });

    await handleAfterPermission({ req, permission, data: transaction });

    return res.status(200).json({ _message: "Record deleted", transaction });
  } catch (e) {
    next(e);
  }
}

module.exports = Delete;
