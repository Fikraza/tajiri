const header = require("../header");

function DeleteRequest({ modelName, item, field }) {
  let request = {
    name: `DELETE ${modelName}`,
    request: {
      method: "DELETE",
      header,
      url: {
        raw: `{{local}}/scheme/${modelName}`,
        host: `{{local}}`,
        path: ["scheme", modelName],
        params: {
          id: "id",
        },
      },
    },
  };

  item.push(request);
}

module.exports = DeleteRequest;
