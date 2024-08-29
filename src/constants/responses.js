const postResponseSuccess =({res, data, message = 'data created successfully'})=>{
    res.json({ success : true, status : 201, response : "Created", message, data })
};

const getResponseSuccess =({res, data, message = 'data fetch successfully'})=>{
    res.json({ success : true, status : 200, response : "OK", message, data })
};

const updateResponseSuccess =({res, data, message = 'data updated successfully'})=>{
    res.json({ success : true, status : 200, response : "OK", message, data })
};

const deleteResponseSuccess =({res, message = 'data deleted successfully'})=>{
    res.json({ success : true, status : 200, response : "OK", message })
};

const errorResponse =({res, message = 'some error occurred'})=>{
    res.json({ success : false, message, })
};

export { postResponseSuccess, getResponseSuccess, updateResponseSuccess, deleteResponseSuccess, errorResponse };