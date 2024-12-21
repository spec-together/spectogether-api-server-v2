create table spectogether.area
(
    area_id        bigint auto_increment
        primary key,
    name           varchar(255)                              not null,
    location       point                                     not null,
    legal_areacode varchar(50)                               not null,
    created_at     timestamp(6) default CURRENT_TIMESTAMP(6) not null,
    updated_at     timestamp(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6)
);

create table spectogether.calendar
(
    calendar_id bigint auto_increment
        primary key,
    created_at  timestamp(6) default CURRENT_TIMESTAMP(6) not null,
    updated_at  timestamp(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6)
);

create table spectogether.contest
(
    contest_id             bigint auto_increment
        primary key,
    title                  varchar(255)                              not null,
    subtitle               varchar(255)                              not null,
    description            text                                      not null,
    host                   varchar(255)                              not null,
    location               point                                     not null,
    online_offline_type    varchar(50)                               not null,
    application_start_date datetime                                  not null,
    application_end_date   datetime                                  not null,
    start_date             datetime                                  not null,
    end_date               datetime                                  not null,
    created_at             timestamp(6) default CURRENT_TIMESTAMP(6) not null,
    updated_at             timestamp(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6)
);

create table spectogether.contest_calendar
(
    contest_calendar_id bigint auto_increment
        primary key,
    contest_id          bigint                                    not null,
    calendar_id         bigint                                    not null,
    created_at          timestamp(6) default CURRENT_TIMESTAMP(6) not null,
    updated_at          timestamp(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6),
    constraint contest_calendar_ibfk_1
        foreign key (contest_id) references spectogether.contest (contest_id),
    constraint contest_calendar_ibfk_2
        foreign key (calendar_id) references spectogether.calendar (calendar_id)
);

create index calendar_id
    on spectogether.contest_calendar (calendar_id);

create index contest_id
    on spectogether.contest_calendar (contest_id);

create table spectogether.email_verification_code
(
    email_verification_code_id bigint auto_increment
        primary key,
    email                      varchar(255)                              not null,
    code                       varchar(255)                              not null,
    created_at                 timestamp(6) default CURRENT_TIMESTAMP(6) not null,
    updated_at                 timestamp(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6)
);

create table spectogether.kakao_user_info
(
    kakao_user_info_id bigint auto_increment
        primary key,
    kakao_id           bigint        not null,
    nickname           varchar(256)  null,
    profile_image_url  varchar(2048) null,
    email              varchar(512)  not null
);

create table spectogether.schedule
(
    schedule_id bigint auto_increment
        primary key,
    calendar_id bigint                                    not null,
    starts_at   datetime                                  not null,
    ends_at     datetime                                  not null,
    location    varchar(255)                              not null,
    memo        text                                      not null,
    created_at  timestamp(6) default CURRENT_TIMESTAMP(6) not null,
    updated_at  timestamp(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6),
    constraint schedule_ibfk_1
        foreign key (calendar_id) references spectogether.calendar (calendar_id)
);

create table spectogether.contest_schedule
(
    contest_schedule_id bigint auto_increment
        primary key,
    contest_id          bigint                                    not null,
    schedule_id         bigint                                    not null,
    created_at          timestamp(6) default CURRENT_TIMESTAMP(6) not null,
    updated_at          timestamp(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6),
    constraint contest_schedule_ibfk_1
        foreign key (contest_id) references spectogether.contest (contest_id),
    constraint contest_schedule_ibfk_2
        foreign key (schedule_id) references spectogether.schedule (schedule_id)
);

create index contest_id
    on spectogether.contest_schedule (contest_id);

create index schedule_id
    on spectogether.contest_schedule (schedule_id);

create index calendar_id
    on spectogether.schedule (calendar_id);

create table spectogether.spec
(
    spec_id    bigint auto_increment
        primary key,
    title      varchar(255)                              not null,
    created_at timestamp(6) default CURRENT_TIMESTAMP(6) not null,
    updated_at timestamp(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6)
);

create table spectogether.studyroom
(
    studyroom_id  bigint auto_increment
        primary key,
    title         varchar(255)                              not null,
    subtitle      varchar(255)                              not null,
    area_id       bigint                                    not null,
    profile_image varchar(255)                              not null,
    target_type   varchar(50)                               not null,
    target_id     bigint                                    not null,
    status        varchar(50)                               not null,
    created_at    timestamp(6) default CURRENT_TIMESTAMP(6) not null,
    updated_at    timestamp(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6),
    constraint studyroom_ibfk_1
        foreign key (area_id) references spectogether.area (area_id)
);

create index area_id
    on spectogether.studyroom (area_id);

create table spectogether.studyroom_calendar
(
    studyroom_calendar_id bigint auto_increment
        primary key,
    studyroom_id          bigint                                    not null,
    calendar_id           bigint                                    not null,
    created_at            timestamp(6) default CURRENT_TIMESTAMP(6) not null,
    updated_at            timestamp(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6),
    constraint studyroom_calendar_ibfk_1
        foreign key (studyroom_id) references spectogether.studyroom (studyroom_id),
    constraint studyroom_calendar_ibfk_2
        foreign key (calendar_id) references spectogether.calendar (calendar_id)
);

create index calendar_id
    on spectogether.studyroom_calendar (calendar_id);

create index studyroom_id
    on spectogether.studyroom_calendar (studyroom_id);

create table spectogether.studyroom_videocall
(
    studyroom_videocall_id bigint auto_increment
        primary key,
    created_at             timestamp(6) default CURRENT_TIMESTAMP(6) not null,
    updated_at             timestamp(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6)
);

create table spectogether.term
(
    term_id      bigint auto_increment
        primary key,
    name         varchar(255)                              not null,
    description  text                                      not null,
    is_required  tinyint(1)                                not null,
    term_version int                                       not null,
    status       varchar(50)                               not null,
    created_at   timestamp(6) default CURRENT_TIMESTAMP(6) not null,
    updated_at   timestamp(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6)
);

create table spectogether.user
(
    user_id       bigint auto_increment
        primary key,
    name          varchar(255)                              not null,
    nickname      varchar(255)                              not null,
    password      varchar(1024)                             not null,
    birthdate     date                                      not null,
    phone_number  varchar(50)                               not null,
    email         varchar(255)                              not null,
    profile_image varchar(255)                              not null,
    spec_level    int          default 1                    not null,
    manner_score  int unsigned default '5000'               not null,
    created_at    timestamp(6) default CURRENT_TIMESTAMP(6) not null,
    updated_at    timestamp(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6),
    constraint user_pk
        unique (phone_number),
    constraint user_pk_2
        unique (email)
);

create table spectogether.board
(
    board_id   bigint auto_increment
        primary key,
    title      varchar(255)                              not null,
    content    text                                      not null,
    author     bigint                                    not null,
    image_url  varchar(255)                              not null,
    created_at timestamp(6) default CURRENT_TIMESTAMP(6) not null,
    updated_at timestamp(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6),
    constraint board_ibfk_1
        foreign key (author) references spectogether.user (user_id)
);

create index author
    on spectogether.board (author);

create table spectogether.contest_board
(
    contest_board_id bigint auto_increment
        primary key,
    contest_id       bigint                                    not null,
    board_id         bigint                                    not null,
    created_at       timestamp(6) default CURRENT_TIMESTAMP(6) not null,
    updated_at       timestamp(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6),
    constraint contest_board_ibfk_1
        foreign key (contest_id) references spectogether.contest (contest_id),
    constraint contest_board_ibfk_2
        foreign key (board_id) references spectogether.board (board_id)
);

create index board_id
    on spectogether.contest_board (board_id);

create index contest_id
    on spectogether.contest_board (contest_id);

create table spectogether.contest_question
(
    contest_question_id bigint auto_increment
        primary key,
    contest_id          bigint                                    not null,
    user_id             bigint                                    not null,
    title               varchar(255)                              not null,
    content             text                                      not null,
    created_at          timestamp(6) default CURRENT_TIMESTAMP(6) not null,
    updated_at          timestamp(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6),
    constraint contest_question_ibfk_1
        foreign key (contest_id) references spectogether.contest (contest_id),
    constraint contest_question_ibfk_2
        foreign key (user_id) references spectogether.user (user_id)
);

create table spectogether.contest_answer
(
    contest_answer_id   bigint auto_increment
        primary key,
    contest_question_id bigint                                    not null,
    answer_id           bigint                                    not null,
    title               varchar(255)                              not null,
    content             text                                      not null,
    created_at          timestamp(6) default CURRENT_TIMESTAMP(6) not null,
    updated_at          timestamp(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6),
    constraint contest_answer_ibfk_1
        foreign key (contest_question_id) references spectogether.contest_question (contest_question_id),
    constraint contest_answer_ibfk_2
        foreign key (answer_id) references spectogether.user (user_id)
);

create index answer_id
    on spectogether.contest_answer (answer_id);

create index contest_question_id
    on spectogether.contest_answer (contest_question_id);

create index contest_id
    on spectogether.contest_question (contest_id);

create index user_id
    on spectogether.contest_question (user_id);

create table spectogether.inquiry
(
    inquiry_id  bigint auto_increment
        primary key,
    user_id     bigint                                    not null,
    title       varchar(255)                              not null,
    content     text                                      not null,
    image_url   varchar(255)                              not null,
    read_at     datetime                                  not null,
    answered_at datetime                                  not null,
    status      varchar(50)                               not null,
    created_at  timestamp(6) default CURRENT_TIMESTAMP(6) not null,
    updated_at  timestamp(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6),
    constraint inquiry_ibfk_1
        foreign key (user_id) references spectogether.user (user_id)
);

create index user_id
    on spectogether.inquiry (user_id);

create table spectogether.inquiry_answer
(
    inquiry_answer_id bigint auto_increment
        primary key,
    inquiry_id        bigint                                    not null,
    admin_id          bigint                                    not null,
    title             varchar(255)                              not null,
    content           text                                      not null,
    image_url         varchar(255)                              not null,
    created_at        timestamp(6) default CURRENT_TIMESTAMP(6) not null,
    updated_at        timestamp(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6),
    constraint inquiry_answer_ibfk_1
        foreign key (inquiry_id) references spectogether.inquiry (inquiry_id),
    constraint inquiry_answer_ibfk_2
        foreign key (admin_id) references spectogether.user (user_id)
);

create index admin_id
    on spectogether.inquiry_answer (admin_id);

create index inquiry_id
    on spectogether.inquiry_answer (inquiry_id);

create table spectogether.schedule_participant
(
    schedule_participant_id bigint auto_increment
        primary key,
    schedule_id             bigint                                    not null,
    participant_id          bigint                                    not null,
    type                    varchar(50)                               not null,
    created_at              timestamp(6) default CURRENT_TIMESTAMP(6) not null,
    updated_at              timestamp(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6),
    constraint schedule_participant_ibfk_1
        foreign key (schedule_id) references spectogether.schedule (schedule_id),
    constraint schedule_participant_ibfk_2
        foreign key (participant_id) references spectogether.user (user_id)
);

create index participant_id
    on spectogether.schedule_participant (participant_id);

create index schedule_id
    on spectogether.schedule_participant (schedule_id);

create table spectogether.studyroom_chat
(
    studyroom_chat_id bigint auto_increment
        primary key,
    sender_id         bigint                                    not null,
    studyroom_id      bigint                                    not null,
    type              varchar(50)                               not null,
    content           text                                      not null,
    created_at        timestamp(6) default CURRENT_TIMESTAMP(6) not null,
    updated_at        timestamp(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6),
    constraint studyroom_chat_ibfk_1
        foreign key (sender_id) references spectogether.user (user_id),
    constraint studyroom_chat_ibfk_2
        foreign key (studyroom_id) references spectogether.studyroom (studyroom_id)
);

create index sender_id
    on spectogether.studyroom_chat (sender_id);

create index studyroom_id
    on spectogether.studyroom_chat (studyroom_id);

create table spectogether.studyroom_member
(
    studyroom_member_id bigint auto_increment
        primary key,
    studyroom_id        bigint                                    not null,
    user_id             bigint                                    not null,
    role                varchar(50)                               not null,
    status              varchar(50)                               not null,
    created_at          timestamp(6) default CURRENT_TIMESTAMP(6) not null,
    updated_at          timestamp(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6),
    constraint studyroom_member_ibfk_1
        foreign key (studyroom_id) references spectogether.studyroom (studyroom_id),
    constraint studyroom_member_ibfk_2
        foreign key (user_id) references spectogether.user (user_id)
);

create index studyroom_id
    on spectogether.studyroom_member (studyroom_id);

create index user_id
    on spectogether.studyroom_member (user_id);

create table spectogether.studyroom_videocall_member
(
    studyroom_videocall_member_id bigint auto_increment
        primary key,
    studyroom_videocall_id        bigint                                    not null,
    member_id                     bigint                                    not null,
    type                          varchar(50)                               not null,
    created_at                    timestamp(6) default CURRENT_TIMESTAMP(6) not null,
    updated_at                    timestamp(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6),
    constraint studyroom_videocall_member_ibfk_1
        foreign key (studyroom_videocall_id) references spectogether.studyroom_videocall (studyroom_videocall_id),
    constraint studyroom_videocall_member_ibfk_2
        foreign key (member_id) references spectogether.user (user_id)
);

create index member_id
    on spectogether.studyroom_videocall_member (member_id);

create index studyroom_videocall_id
    on spectogether.studyroom_videocall_member (studyroom_videocall_id);

create table spectogether.todo
(
    todo_id    bigint auto_increment
        primary key,
    deadline   datetime                                  not null,
    title      varchar(255)                              not null,
    subtitle   varchar(255)                              not null,
    content    text                                      not null,
    creater_id bigint                                    not null,
    status     varchar(50)                               not null,
    created_at timestamp(6) default CURRENT_TIMESTAMP(6) not null,
    updated_at timestamp(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6),
    constraint todo_ibfk_1
        foreign key (creater_id) references spectogether.user (user_id)
);

create table spectogether.studyroom_todo
(
    studyroom_todo_id bigint auto_increment
        primary key,
    studyroom_id      bigint                                    not null,
    todo_id           bigint                                    not null,
    created_at        timestamp(6) default CURRENT_TIMESTAMP(6) not null,
    updated_at        timestamp(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6),
    constraint studyroom_todo_ibfk_1
        foreign key (studyroom_id) references spectogether.studyroom (studyroom_id),
    constraint studyroom_todo_ibfk_2
        foreign key (todo_id) references spectogether.todo (todo_id)
);

create index studyroom_id
    on spectogether.studyroom_todo (studyroom_id);

create index todo_id
    on spectogether.studyroom_todo (todo_id);

create index creater_id
    on spectogether.todo (creater_id);

create table spectogether.todo_member
(
    todo_member_id   bigint auto_increment
        primary key,
    todo_id          bigint                                    not null,
    assigned_user_id bigint                                    not null,
    status           varchar(50)                               not null,
    comment          text                                      not null,
    photo            varchar(255)                              not null,
    created_at       timestamp(6) default CURRENT_TIMESTAMP(6) not null,
    updated_at       timestamp(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6),
    constraint todo_member_ibfk_1
        foreign key (todo_id) references spectogether.todo (todo_id),
    constraint todo_member_ibfk_2
        foreign key (assigned_user_id) references spectogether.user (user_id)
);

create index assigned_user_id
    on spectogether.todo_member (assigned_user_id);

create index todo_id
    on spectogether.todo_member (todo_id);

create table spectogether.user_area
(
    user_area_id bigint auto_increment
        primary key,
    user_id      bigint                                    not null,
    area_id      bigint                                    not null,
    created_at   timestamp(6) default CURRENT_TIMESTAMP(6) not null,
    updated_at   timestamp(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6),
    constraint user_area_ibfk_1
        foreign key (user_id) references spectogether.user (user_id),
    constraint user_area_ibfk_2
        foreign key (area_id) references spectogether.area (area_id)
);

create index area_id
    on spectogether.user_area (area_id);

create index user_id
    on spectogether.user_area (user_id);

create table spectogether.user_calendar
(
    user_id     bigint                                    not null,
    calendar_id bigint                                    not null,
    created_at  timestamp(6) default CURRENT_TIMESTAMP(6) not null,
    updated_at  timestamp(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6),
    primary key (user_id, calendar_id),
    constraint user_calendar_ibfk_1
        foreign key (user_id) references spectogether.user (user_id),
    constraint user_calendar_ibfk_2
        foreign key (calendar_id) references spectogether.calendar (calendar_id)
);

create index calendar_id
    on spectogether.user_calendar (calendar_id);

create table spectogether.user_oauth
(
    user_oauth_id bigint auto_increment
        primary key,
    user_id       bigint                                    not null,
    oauth_type    varchar(50)                               not null,
    oauth_id      varchar(255)                              not null,
    created_at    timestamp(6) default CURRENT_TIMESTAMP(6) not null,
    updated_at    timestamp(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6),
    constraint user_oauth_ibfk_1
        foreign key (user_id) references spectogether.user (user_id)
);

create index user_id
    on spectogether.user_oauth (user_id);

create table spectogether.user_refresh_token
(
    user_refresh_token_id bigint auto_increment
        primary key,
    user_id               bigint                                    not null,
    refresh_token         text                                      not null,
    created_at            timestamp(6) default CURRENT_TIMESTAMP(6) not null,
    updated_at            timestamp(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6),
    constraint user_refresh_token_ibfk_1
        foreign key (user_id) references spectogether.user (user_id)
);

create index user_id
    on spectogether.user_refresh_token (user_id);

create table spectogether.user_spec
(
    user_spec_id bigint auto_increment
        primary key,
    user_id      bigint                                    not null,
    spec_id      bigint                                    not null,
    created_at   timestamp(6) default CURRENT_TIMESTAMP(6) not null,
    updated_at   timestamp(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6),
    constraint user_spec_ibfk_1
        foreign key (user_id) references spectogether.user (user_id),
    constraint user_spec_ibfk_2
        foreign key (spec_id) references spectogether.spec (spec_id)
);

create index spec_id
    on spectogether.user_spec (spec_id);

create index user_id
    on spectogether.user_spec (user_id);

create table spectogether.user_studyroom
(
    user_studyroom_id bigint auto_increment
        primary key,
    studyroom_id      bigint                                    not null,
    user_id           bigint                                    not null,
    created_at        timestamp(6) default CURRENT_TIMESTAMP(6) not null,
    updated_at        timestamp(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6),
    constraint user_studyroom_ibfk_1
        foreign key (studyroom_id) references spectogether.studyroom (studyroom_id),
    constraint user_studyroom_ibfk_2
        foreign key (user_id) references spectogether.user (user_id)
);

create index studyroom_id
    on spectogether.user_studyroom (studyroom_id);

create index user_id
    on spectogether.user_studyroom (user_id);

create table spectogether.user_term
(
    user_term_id bigint auto_increment
        primary key,
    term_id      bigint                                    not null,
    user_id      bigint                                    not null,
    is_agreed    tinyint(1)                                not null,
    created_at   timestamp(6) default CURRENT_TIMESTAMP(6) not null,
    updated_at   timestamp(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6),
    constraint user_term_ibfk_1
        foreign key (term_id) references spectogether.term (term_id),
    constraint user_term_ibfk_2
        foreign key (user_id) references spectogether.user (user_id)
);

create index term_id
    on spectogether.user_term (term_id);

create index user_id
    on spectogether.user_term (user_id);

create table spectogether.user_verified_email
(
    user_verified_email_id bigint auto_increment
        primary key,
    user_id                bigint                                    not null,
    verified_email         varchar(255)                              not null,
    verification_type      varchar(50)                               not null,
    status                 varchar(50)                               not null,
    created_at             timestamp(6) default CURRENT_TIMESTAMP(6) not null,
    updated_at             timestamp(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6),
    constraint user_verified_email_ibfk_1
        foreign key (user_id) references spectogether.user (user_id)
);

create index user_id
    on spectogether.user_verified_email (user_id);

