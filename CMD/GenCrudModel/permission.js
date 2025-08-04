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
   allowedMethods:["GET", "POST", "PUT", "PATCH", "DELETE"],
   beforeOperation:[], // This are before any operation ie [GET,POST,PUT,PATCH,DELETE]
   afterOperation:[], // This are before any operation ie [GET,POST,PUT,PATCH,DELETE]
   beforeGet:[bf1], // all your functions for before db change
   afterGet:[bf1], // all your functions for before db change
   beforePut:[bf1], // all your functions for before db change
   afterPut:[bf1], // all your functions for before db change
   beforePatch:[bf1], // all your functions for before db change
   afterPatch:[bf1], // all your functions for before db change
   beforeDelete:[bf1], // all your functions for before db change
   afterDelete:[bf1], // all your functions for before db change
 
 }

${exportString}
`;

  return permission;
};

export default getPermission;
