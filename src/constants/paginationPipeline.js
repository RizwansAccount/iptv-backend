
const paginationPipeline =(req)=>{
    const page =  +req.query.page;
    const limit = +req.query.limit;
    const skip =  (page-1)*limit;

    const pipeline = [ { $match : { is_deleted : false} } ];

    if(page && limit) {  pipeline.push({$skip : skip }, {$limit : limit});  };

    pipeline.push({$project : { is_deleted : 0, __v :0 } });

    return pipeline;
};

export default paginationPipeline;