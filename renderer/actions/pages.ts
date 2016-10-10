import Action from './type';

export function createPage(): Action {
    return {
        type: 'CreatePage',
    };
}

export function configurePage(index: number, url: string, image_url: string): Action {
    return {
        type: 'ConfigurePage',
        index,
        url,
        image_url,
    };
}