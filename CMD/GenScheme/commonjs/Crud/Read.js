const prisma = require("../../Prisma");

const getModel = require("./../Utils/CLI/getModel");

async function Read(req, res, next) {
  try {
    // code here

    const { model } = req.params;

    const { id } = req.query;

    if (!id) {
      throw { custom: true, message: "Id required" };
    }

    const modelDoc = getModel(model);

    const { include, permission } = modelDoc;

    const allowedMethods = Array.isArray(permission?.allowedMethods)
      ? permission?.allowedMethods
      : [];

    if (!allowedMethods?.includes("GET")) {
      throw { custom: true, message: "Model Get Forbiden ", status: 403 };
    }

    let doc = await prisma[model].findUnique({
      where: { id },
      include: include || {},
    });

    return res.status(200).json({ ...doc });
  } catch (e) {
    next(e);
  }
}

module.exports = Read;
