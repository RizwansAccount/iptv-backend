
const paginationPipeline =(req)=>{
    const page =  +req.query.page;
    const limit = +req.query.limit;
    const skip =  (page-1)*limit;

    const search = req.query.search;
    const pipeline = [];

    if (search) {
        pipeline.push({
            $match: {
                name: { $regex: search, $options: 'i' }
            }
        });
    }
    
    if(page && limit) {  pipeline.push({$skip : skip }, {$limit : limit});  };

    return pipeline;
};

export default paginationPipeline;