import {List} from 'immutable';
import * as Storage from './storage';
import {InPageSearch} from 'electron-in-page-search';

export interface Page {
    url: string;
    icon_image: string;
    configured: boolean;
    title: string;
    reload_on_show: boolean;
    reload_min_interval: number | null;
}

export interface PagesState {
    index: number | null;
    all: List<Page>;
}

const loaded = Storage.load();

export const DefaultPagesState: PagesState =
    loaded !== null ? loaded.pages : {
        index: null,
        all: List<Page>(),
    };

export interface WebViewState {
    progress: number;
    loading: boolean;
    element: Electron.WebViewElement | null;
    search: InPageSearch | null;
    timestamp: number | null;
}

export const DefaultWebViewState: WebViewState = {
    progress: 0,
    loading: false,
    element: null,
    search: null,
    timestamp: null,
};

interface State {
    pages: PagesState;
    webview: WebViewState;
}
export default State;
