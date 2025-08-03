const getPdf = (type) => {
  let exportString =
    type === "module" ? "export default pdf" : "module.exports=pdf";

  const pdf = `

/**
---pdf should return an object with property head and data.
 
  head should be an array of the title for the table
  data can either be an array or a function. The array contains the nested keys 
  of the table

  if data is a function it will be called for each record. 
  It should return an array of <td></td> for each record.

 
 **/

  const pdf={
   head:[],
   data:[]
  }


  ${exportString}
`;

  return pdf;
};

export default getPdf;
