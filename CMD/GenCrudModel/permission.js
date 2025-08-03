const getPermission = (type) => {
  let exportString =
    type === "module"
      ? "export default permission"
      : "module.exports=permission";

  const permission = `

function bf1(req){
  /*
    if this bf1 function throws an error 
    format of error throw {custom:true,message:"",status:401} 
  */
    return
}

const permission={
   allowedMethods:["GET", "POST", "PUT", "PATCH", "DELETE"],
   beforeOperation:[bf1], // all your functions for before db change
   afterOperation:[bf1]  // all your functions after db changes are made
 }

${exportString}
`;

  return permission;
};

export default getPermission;
