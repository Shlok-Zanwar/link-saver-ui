import React, { useCallback, useEffect, useState } from "react";
import { TbPlayerTrackNext } from "react-icons/tb";
import { GrLinkNext } from "react-icons/gr";
import { AiOutlineLink, AiOutlineTags } from "react-icons/ai";
import { ReactTags } from "react-tag-autocomplete";
import useLinkPreview from "use-link-preview";
import { Button, Image, Input, message } from "antd";
import { MdOutlineSubtitles, MdTitle } from "react-icons/md";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import MyConditional from "../Components/MyConditional";

export default function LinkSaver({ isEdit }) {
    const editId = useParams().id;
    const [searchParams, setSearchParams] = useSearchParams();
    const sharedUrl = searchParams.get("text");
    const navigate = useNavigate();
    // const sharedText = searchParams.get('text');

    const [loading, setLoading] = useState(false);
    const [details, setDetails] = useState({
        title: "",
        description: "",
        url: "",
        tags: [],
        metadata: {},
    });
    const [options, setOptions] = useState({
        tags: [],
        tagsLoading: false,
    });

    const [link, setLink] = useState("");
    const { metadata, isLoading, isError } = useLinkPreview(link);

    useEffect(() => {
        if(sharedUrl && !isEdit) {
            setDetails(prev => ({
                ...prev,
                url: sharedUrl,
            }));
        }
        setLink(sharedUrl);
    }, [sharedUrl, isEdit]);


    const onAdd = useCallback(
        newTag => {
            // setDetails({ ...details, tags: [...details.tags, newTag] });
            setDetails(prev => ({ ...prev, tags: [...prev.tags, newTag] }));
        },
        [details.tags]
    );

    const onDelete = useCallback(
        tagIndex => {
            // setDetails({ ...details, tags: details.tags.filter((_, i) => i !== tagIndex) });
            setDetails(prev => ({ ...prev, tags: prev.tags.filter((_, i) => i !== tagIndex) }));
        },
        [details.tags]
    );

    console.log(details);

    const getTags = async () => {
        setOptions(prev => ({ ...prev, tagsLoading: true }));
        await axios
            .get("/tags/get")
            .then(res => {
                const data = res.data.data;
                console.log(data);
                const tags = data.map(tag => ({ value: tag.tag_id, label: tag.tag }))
                setOptions(prev => ({ ...prev, tags: tags }));
            })
            .catch(err => {
                err.handleGlobally && err.handleGlobally("Error fetching tags. Please Refresh !");
            });
        setOptions(prev => ({ ...prev, tagsLoading: false }));
    };

    const getData = async () => {
        setLoading(true);
        await axios
            .get(`/links/get/${editId}`)
            .then(res => {
                const data = res.data.data;
                setDetails(prev => ({
                    ...prev,
                    title: data.title,
                    description: data.description,
                    url: data.url,
                    tags: data.tags.map(tag => ({ value: tag.tag_id, label: tag.tag })),
                    metadata: data.metadata,
                }));
                // setLink(data.url);
            })
            .catch(err => {
                err.handleGlobally && err.handleGlobally("Error fetching link. Please Refresh !");
            });
        setLoading(false);
    };

    useEffect(() => {
        getTags();
        if (isEdit) {
            getData();
        }
    }, []);

    const setDetailsKey = (key, value) => {
        setDetails(prev => ({ ...prev, [key]: value }));
    };

    useEffect(() => {
        if (metadata) {
            setDetails(prev => ({
                ...prev,
                metadata: metadata,
                title: metadata.title,
                description: metadata.description,
            }));
        }
    }, [metadata]);

    const onSubmit = async () => {
        setLoading(true);
        // Iterate through the tags, If the tag.value is not a number, then it is a new tag, therefor change it to 0.
        // and return format {tag_id: 0, tag: "new tag"} else {tag_id: 1, tag: "existing tag"}

        const tags = details.tags.map(tag => {
            if (isNaN(tag.value)) {
                return { tag_id: 0, tag: tag.label };
            } else {
                return { tag_id: tag.value, tag: tag.label };
            }
        });

        if (isEdit) {
            await axios
                .post(`/links/edit`, {
                    link_id: editId,
                    title: details.title,
                    description: details.description,
                    url: details.url,
                    tags: tags,
                    metadata: details.metadata,
                })
                .then(res => {
                    message.success("Link Updated Successfully !");
                    navigate("/links");
                })
                .catch(err => {
                    err.handleGlobally && err.handleGlobally("Error Adding link. Please Refresh !");
                });
        } else {
            await axios
                .post("/links/add", {
                    title: details.title,
                    description: details.description,
                    url: details.url,
                    tags: tags,
                    metadata: details.metadata,
                })
                .then(res => {
                    message.success("Link Added Successfully !");
                    navigate("/links");
                })
                .catch(err => {
                    err.handleGlobally && err.handleGlobally("Error Adding link. Please Refresh !");
                });
        }
        setLoading(false);
    };


    return (
        <div
            style={{
                width: "100%",
                minHeight: "95vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-around",
                flexDirection: "column",
                // padding: "10px",
            }}
        >
            {/* <div style={{ width: "min(450px, calc(100% - 25px))" }}> */}
            <div className="card">
                <div className="card2">
                    <div className="form" style={{ paddingBottom: "50px" }}>
                        <p id="heading">{isEdit ? "Edit Link" : "Add Link"}</p>
                        <div className="field">
                            <AiOutlineLink className="input-icon" />
                            <input
                                type="text"
                                className="input-field"
                                placeholder="Link"
                                value={details.url}
                                onChange={e => { setDetailsKey("url", e.target.value)}}
                                style={{ color: "#fff" }}
                                disabled={link?.length || isEdit}
                            />
                            {/* <Button icon={<GrLinkNext />} onClick={() => { setLink(temp); }} /> */}
                            <MyConditional hidden={link?.length || isEdit}>
                                <TbPlayerTrackNext
                                    className="input-icon"
                                    onClick={() => { setLink(details.url); }}
                                    title="Search link"
                                />
                            </MyConditional> 
                        </div>
                        <div
                            className="field"
                            style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}
                        >
                            <div style={{ height: "100px", width: "100px" }}>
                                <img
                                    src={details?.metadata?.img || "sss"}
                                    alt=""
                                    style={{ height: "100px", objectFit: "contain", borderRadius: "10px" }}
                                    onError={e => {
                                        e.target.onerror = null;
                                        e.target.src = "/image-not-found.png";
                                    }}
                                />
                            </div>
                            <div
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "flex-start",
                                    gap: "10px",
                                }}
                            >
                                {/* <p>Shlok</p> */}
                                <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                                    <MdTitle className="input-icon" title="Title" />
                                    <input
                                        type="text"
                                        className="input-field"
                                        placeholder="Title"
                                        value={details.title}
                                        onChange={(e) => { setDetailsKey("title", e.target.value)}}
                                        style={{ color: "#fff" }}
                                    />
                                </div>
                                <div style={{ display: "flex", alignItems: "", width: "100%" }}>
                                    <MdOutlineSubtitles className="input-icon" title="Description" />
                                    <textarea
                                        type="text"
                                        className="input-field"
                                        placeholder="Description"
                                        rows={3}
                                        value={details.description}
                                        onChange={(e) => { setDetailsKey("description", e.target.value)}}
                                        style={{ color: "#fff" }}
                                        autoSize={{ minRows: 2, maxRows: 2 }}
                                        classNames={{ textarea: "input-field" }}
                                    />
                                </div>
                            </div>
                        </div>
                        <p style={{ margin: "15px 0px 0px 10px", display: "inline-flex", alignItems: "center", gap: "10px" }}>
                            {" "}
                            <AiOutlineTags className="input-icon" />
                            Add Tags to identify your links better
                        </p>
                        <ReactTags
                            id="country-selector"
                            placeholderText="Add Tags"
                            labelText="Select Tags"
                            onAdd={onAdd}
                            onDelete={onDelete}
                            selected={details.tags}
                            suggestions={options.tags}
                            activateFirstOption
                            allowBackspace={true}
                            allowNew
                            classNames={{
                                root: "react-tags",
                                label: "react-tags__label",
                                tagList: "react-tags__list",
                                tagListItem: "react-tags__list-item",
                                tag: "react-tags__tag field",
                                comboBox: "field react-tags__combobox ",
                                input: "react-tags__combobox-input",
                                listBox: "react-tags__listbox",
                                option: "react-tags__listbox-option",
                                optionIsActive: "react-tags__listbox-option is-active",
                            }}

                            // {...options}
                        />
                        <button className="button3" onClick={onSubmit}>
                            {isEdit ? "Update" : "Add"}
                        </button>

                        {/* </div> */}
                    </div>
                </div>
            </div>
            {/* </div> */}
            <span>
                href={window.location.href}
            </span>
        </div>
    );
}
