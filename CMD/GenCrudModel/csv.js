const getCsv = (type) => {
  let exportString =
    type === "module" ? "export default csv" : "module.exports=csv";

  const csv = `

/**
---CSV should return an object with property head and data.
 
  head should be an array of the title for the table
  data can either be an array or a function. The array contains the nested keys 
  of the table

  if data is a function it will be called for each record. it should return  
  an array of the different 

 
 **/

  const csv={
   head:[],
   data:[]
  }


  ${exportString}
`;

  return csv;
};

export default getCsv;
