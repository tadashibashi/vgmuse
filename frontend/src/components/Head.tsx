import {Helmet} from "react-helmet-async";

interface Props {
    title?: string;
    subtitle?: string;
    description?: string;
}

export default function(p: Props) {
    // prepare props
    let title = "";
    if (p.title)
        title = p.title && (p.title + (p.subtitle ? ": " + p.subtitle: ""));

    return (
        <Helmet>
            {title && <title>{title}</title>}
            {p.description && <meta name="description" content={p.description} />}

            {title && <meta property="og:title" content={title} />}
            {p.description && <meta property="og:description" content={p.description} />}
        </Helmet>
    );
}
