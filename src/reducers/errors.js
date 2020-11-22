const initialState={
    msg: {},
    status:null
}

export default function(state = initialState, action){
    switch(action.type){
        case "GET_ERRORS":
            return{
                msg: action.data.msg,
                status:action.data.status,
            };
            default:
                return state;
    }
}