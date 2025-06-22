-- 最新进度的 sql 内容 用于快速部署开发环境进行开发测试
-- 7792521

create table bili_collect
(
    id          text not null
        primary key,
    title       TEXT,
    cover       TEXT,
    video_id    text,
    play_num    INTEGER,
    up_name     TEXT,
    up_mid      INTEGER,
    media_count integer,
    custom_name TEXT
);

create table bili_video
(
    id         TEXT,
    collect_id TEXT,
    name       TEXT,
    bvid       TEXT,
    cid        TEXT,
    pic_url    TEXT
);

create table lyrics_time_align
(
    bvid     text not null,
    cid      text not null,
    songId   text not null,
    timeDiff real,
    primary key (bvid, cid, songId)
);

create table mapping_collect_video
(
    id         TEXT
        constraint mapping_collect_video_pk
            primary key,
    collect_id TEXT,
    video_id   TEXT
);





