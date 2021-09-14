/**
 * ROI API
 */
 import API from '../../flux/actions/apis/api';
 import C from '../../flux/actions/constants'
 
 export class ROIAction extends API {
    constructor(payload, timeout = 30000) {
        super('POST', timeout, false);
        this.payload = payload;
        this.type = C.ROI_DATA;
    }
    toString() {
        return `${super.toString()} payload: ${this.payload} type: ${this.type}`
    }

    processResponse(res) {
        super.processResponse(res)
        if (res) {            
            this.response=res;
        }
    }

    apiEndPoint() {
        return `${super.apiEndPoint()}/roi`;
    }

    getHeaders() {
        return {
            'Content-Type': 'application/json',
        }
    }

    getPayload() {
        return this.response
    }
 
 }