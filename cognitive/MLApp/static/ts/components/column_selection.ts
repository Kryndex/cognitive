interface ColumnSelectionComponentCreateParams {
    component_id: number;
}

interface ColumnSelectionComponentPutParams {
    component_id: number;
}

class ColumnSelection extends ComponentBase {
    constructor () {
        super({
            "name": "Column Selection",
            "width": 0,
            "height":0,
            "input":1,
            "output":1
        })
    }

    public create_request(params: ColumnSelectionComponentCreateParams) {
        var json_data = {
            component_id: params.component_id
        };

        var api_url = '/api/v1' + '/operations/projection/';
        ComponentBase._send_request(api_url, "POST", json_data, this);
    }

    public put_request(params: ColumnSelectionComponentPutParams) {
        var json_data = {
            component_id: params.component_id
        };

        var api_url = '/api/v1' + '/operations/projection/' + this.get_backend_id();
        ComponentBase._send_request(api_url, "PUT", json_data, this);
    }

    public delete_request() {
        var api_url = '/api/v1'  + '/operations/projection/' + this.get_backend_id();
        ComponentBase._send_request(api_url, "DELETE", {}, null);
    }
}