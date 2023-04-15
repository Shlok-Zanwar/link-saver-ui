import React, { useCallback, useEffect } from "react";
import { BiSearchAlt } from "react-icons/bi";
import { ReactTags } from "react-tag-autocomplete";
import { MdOutlineAddLink, MdOutlineSubtitles, MdTitle } from "react-icons/md";
import { AiOutlineLink, AiOutlineTags } from "react-icons/ai";
import { IoLogOutOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { ar_logoutUser } from "../Redux/Actions/AuthActions";

const linksEg = [
    {
        id: 1,
        title: "Google",
        url: "https://www.google.com",
        description: "Search Engine",
        metadata: { img: "dsd" },
        tags: ["search", "search", "search", "search", "search", "search", "engine"],
    },
    {
        id: 1,
        title: "Google",
        url: "https://www.google.com",
        description: "Search Engine Search Engine Search Engine Search Engine Search Engine Search Engine ",
        metadata: { img: "dsd" },
    },
    { id: 1, title: "Google", url: "https://www.google.com", description: "Search Engine", metadata: { img: "dsd" } },
    { id: 1, title: "Google", url: "https://www.google.com", description: "Search Engine", metadata: { img: "dsd" } },
    { id: 1, title: "Google", url: "https://www.google.com", description: "Search Engine", metadata: { img: "dsd" } },
];
export default function AllLinks() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [details, setDetails] = React.useState({
        search: "",
        tags: [],
        input: "",
    });

    const [options, setOptions] = React.useState({
        tags: [],
        tagsLoading: false,
    });

    const [linksLoading, setLinksLoading] = React.useState(false);
    const [masterLinks, setMasterLinks] = React.useState([]);

    const getTags = async () => {
        setOptions(prev => ({ ...prev, tagsLoading: true }));
        await axios
            .get("/tags/get")
            .then(res => {
                const data = res.data.data;
                console.log(data);
                const tags = data.map(tag => ({ value: tag.tag_id, label: tag.tag }))
                setOptions(prev => ({ ...prev, tags: tags }));
                // Set max 5 tags
                setDetails(prev => ({ ...prev, tags: tags.slice(0, 5) })); 
            })
            .catch(err => {
                err.handleGlobally && err.handleGlobally("Error fetching tags. Please Refresh !");
            });
        setOptions(prev => ({ ...prev, tagsLoading: false }));
    };

    useEffect(() => {
        getTags();
    }, []);

    // useEffect(() => {
    //     console.log(details.tags);
        
    const getLinks = async () => {
        setLinksLoading(true);
        await axios.post("/links/get", {
            tags: details.tags.map(tag => tag.value),
        })
        .then(res => {
            const data = res.data.data;
            console.log(data);
            setMasterLinks(data);
        })
        .catch(err => {
            err.handleGlobally && err.handleGlobally("Error fetching links. Please Refresh !");
        });
        setLinksLoading(false);
    };

    useEffect(() => {
        if(!details.tags.length) {
            setMasterLinks([]);
            return;
        }
        getLinks();
    }, [details.tags]);


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


    const setDetailsKey = (key, value) => {
        setDetails(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div
            style={{
                width: "100%",
                minHeight: "95vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "",
                flexDirection: "column",
                padding: "10px",
                gap: "20px",
            }}
        >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", gap: "20px" }}>
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
                    onInput={e => {
                        setDetailsKey("input", e);
                    }}
                    renderInput={({ classNames, inputWidth, ...props }) => (
                        <div className="field" style={{ width: "100%", justifyContent: "space-between", minWidth: "300px" }}>
                            <input type="text" className={classNames.input} style={{ width: inputWidth }} {...props} />
                            <BiSearchAlt
                                className="input-icon"
                                onClick={() => {
                                    setDetailsKey("search", details.input);
                                }}
                                title="Search link"
                            />
                        </div>
                    )}
                    // allowNew
                    // classNames={{
                    //     root: "react-tags field",
                    //     label: "react-tags__label",
                    //     tagList: "react-tags__list react-tags__list-home-ext",
                    //     tagListItem: "react-tags__list-item",
                    //     tag: "react-tags__tag react-tags__tag-home-ext field",
                    //     comboBox: "react-tags__combobox",
                    //     input: "react-tags__combobox-input",
                    //     listBox: "react-tags__listbox",
                    //     option: "react-tags__listbox-option",
                    //     optionIsActive: "react-tags__listbox-option is-active",
                    // }}
                    classNames={{
                        root: "react-tags",
                        label: "react-tags__label",
                        tagList: "react-tags__list",
                        tagListItem: "react-tags__list-item",
                        tag: "react-tags__tag field",
                        comboBox: "react-tags__combobox ",
                        input: "react-tags__combobox-input",
                        listBox: "react-tags__listbox",
                        option: "react-tags__listbox-option",
                        optionIsActive: "react-tags__listbox-option is-active",
                    }}
                />
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginRight: '10px', flexDirection: 'column' }}>
                    
                    <IoLogOutOutline className="input-icon" title="Logout" style={{ cursor: 'pointer' }} onClick={() => dispatch(ar_logoutUser())} />
                    <Link to="/links/add">
                        <MdOutlineAddLink className="input-icon" title="Add New Link" style={{ cursor: 'pointer' }} />
                    </Link>

                </div>
            </div>
            <div
                style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "20px",
                    flexWrap: "wrap",
                }}
            >
                {masterLinks.map((link, index) => (
                    <div
                        className="field"
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            width: "min(350px, calc(100% - 25px))",
                            boxShadow: "0px 0px 2px 0.5px rgb(0, 255, 200)",
                        }}
                        key={index}
                        onDoubleClick={() => { navigate(`/links/edit/${link.link_id}`) }}
                    >
                        <div style={{ width: "100px" }}>
                            <img
                                src={link?.metadata?.img || "sss"}
                                alt=""
                                style={{ width: "100px", objectFit: "contain", borderRadius: "10px" }}
                                onError={e => {
                                    e.target.onerror = null;
                                    e.target.src =
                                        "https://www.salonlfc.com/wp-content/uploads/2018/01/image-not-found-1-scaled.png";
                                }}
                            />
                        </div>
                        <div
                            style={{
                                width: "calc(100% - 100px)",
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "flex-start",
                                gap: "10px",
                            }}
                        >
                            {/* <p>Shlok</p> */}
                            <Link to={link.url} target="_blank" style={{ textDecoration: "none" }}>
                                <div className="div-icon-and-info">
                                    <AiOutlineLink className="input-icon" title="Link" />
                                    <span className="input-field span-ellipsis">{link?.url}</span>
                                </div>
                            </Link>
                            <div className="div-icon-and-info">
                                <MdTitle className="input-icon" title="Title" />
                                <span className="input-field span-ellipsis" style={{ color: "#fff" }} title={link?.title}>
                                    {link?.title}
                                </span>
                            </div>
                            <div className="div-icon-and-info">
                                <MdOutlineSubtitles className="input-icon" title="Title" />
                                <span className="input-field span-ellipsis" style={{ color: "#fff" }} title={link?.description}>
                                    {link?.description}
                                </span>
                            </div>
                            <div className="div-icon-and-info">
                                <AiOutlineTags className="input-icon" title="Tags" />
                                <span
                                    className="input-field span-ellipsis"
                                    style={{ color: "#fff" }}
                                    title={link?.tags?.map(tag => tag.label).join(", ")}
                                >
                                    {link?.tags?.map(tag => tag.tag).join(", ")}

                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
