import { PageRequestParams } from './types/page';

export type RequestParamValue = string | boolean | number | undefined;

class URLBuilder {
    private static internalURL: URL;

    static url(url: string) {
        this.internalURL = new URL(`${window.location.origin}${url}`);
        return this;
    }

    static param(name: string, value: RequestParamValue) {
        if (value === undefined) return this;
        this.internalURL.searchParams.append(name, `${value}`);
        return this;
    }

    static params(params: PageRequestParams) {
        this.appendBasicParams(params);
        this.appendFilterParams(params?.filter?.equals, 'equals');
        this.appendFilterParams(params?.filter?.contains, 'contains');
        this.appendFilterParams(params?.filter?.in, 'in');
        return this;
    }

    static build() {
        return this.internalURL.href.replace('%2C', ',');
    }

    private static appendBasicParams(params: PageRequestParams) {
        if (params !== undefined) 
        { Object.entries(params)
            .filter(([name, value]) => name !== 'filter' && value !== undefined)
            .forEach(([name, value]) => this.appendBasicParam(name, value)); }
        
    }

    private static appendBasicParam(name: string, value) {
        if (name === 'sort') 
        { this.internalURL.searchParams.append(name, `${value.by},${value.order}`); }
        else 
        { this.internalURL.searchParams.append(name, `${value}`); }
        
    }

    private static appendFilterParams(params, condition?: string) {
        if (params !== undefined) 
        { Object.entries(params)
            .filter(([, value]) => value !== undefined && value !== '')
            .forEach(([name, value]) => this.internalURL.searchParams.append(`${name}.${condition}`, `${value}`)); }
        
    }
}

export default URLBuilder;
