import * as React from 'react';
import {Page} from '../states/pages';
import log from '../log';
import {Dispatch} from '../store';

interface IconProps extends React.Props<Icon> {
    page: Page;
    isCurrent: boolean;
    index: number;
    dispatch: Dispatch;
}

function renderIconContents(p: Page) {
    if (!p.icon_image) {
        return <div className="page-icon__char">{p.title.charAt(0)}</div>;
    }
    return <img src={p.icon_image} alt={p.url}/>;
}

export default class Icon extends React.Component<IconProps, {}> {
    constructor(props: IconProps) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    onClick(e: React.MouseEvent<HTMLDivElement>) {
        e.stopPropagation();
        if (this.props.isCurrent) {
            log.debug('TODO: Open Configuration for this icon');
            this.props.dispatch({
                type: 'SetConfigured',
                index: this.props.index,
                value: false,
            });
        } else {
            log.debug('TODO: Open URL with <webview>');
        }
    }

    render() {
        const {page} = this.props;
        return (
            <div className="page-icon" title={page.title || page.url} onClick={this.onClick}>
                {renderIconContents(page)}
            </div>
        );
    }
}
