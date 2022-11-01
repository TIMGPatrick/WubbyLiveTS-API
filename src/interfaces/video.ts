interface video {
    id: string;
    title: string;
    uploaded_at: Date;
    created_at: Date;
    description: string;
    video_tags: string;
    user_id: string;
    dash_manifest_url: string;
    hls_manifest_url: string;
}

export {video}
