const header = require("../header");

function searchListRequest({ modelName, methods, search }) {
  const item = [];
  let findGet = methods.find((el) => el?.toUpperCase() === "GET");

  if (!findGet) {
    return;
  }
  let listRequest = {
    name: `List ${modelName}`,
    request: {
      method: "GET",
      header,
      url: {
        raw: `{{local}}/scheme/list/${modelName}`,
        host: `{{local}}`,
        path: ["scheme", "list", modelName], // Only the host
      },
    },
  };

  item.push(listRequest);

  if (search) {
    let searchRequest = {
      name: `Search ${modelName}`,
      request: {
        method: "GET",
        header,
        url: {
          raw: `{{local}}/scheme/fuse-search/${modelName}`,
          host: `{{local}}`,
          path: ["scheme", "fuse-search", modelName],
        },
        query: {
          search: "abv",
        },
      },
    };
    item.push(searchRequest);
  }

  return item;
}

module.exports = searchListRequest;
