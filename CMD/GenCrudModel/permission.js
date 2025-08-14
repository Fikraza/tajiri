const getPermission = (type) => {
  let exportString =
    type === "module"
      ? "export default permission"
      : "module.exports=permission";

  const permission = `

/*

*/

function bf1(req){
  /*
    if this bf1 function throws an error 
    format of error throw {custom:true,message:"",status:401} 
  */
    return
}


const permission={
  allowedMethods: ["GET", "POST", "PUT", "PATCH", "DELETE"],

  // Runs before any operation
  beforeOperation: [],

  // Runs before specific operations
  beforeGet: [bf1],
  beforePost: [bf1],
  beforePut: [bf1],
  beforePatch: [bf1],
  beforeDelete: [bf1],

  // Runs after any operation
  afterOperation: [],

  // Runs after specific operations
  afterGet: [bf1],
  afterPost: [bf1],
  afterPut: [bf1],
  afterPatch: [bf1],
  afterDelete: [bf1]
 
 }

${exportString}
`;

  return permission;
};

export default getPermission;
