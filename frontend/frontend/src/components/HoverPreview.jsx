function HoverPreview({ movie }) {

    if (!movie) return null;

    return (
        <div
            style={{
                position: "absolute",
                width: "340px",
                background: "#181818",
                borderRadius: "10px",
                overflow: "hidden",
                zIndex: 9999,
                boxShadow: "0 15px 40px rgba(0,0,0,.7)"
            }}
        >

            <video
                src={movie.video}
                autoPlay
                muted
                loop
                playsInline
                style={{
                    width: "100%",
                    height: "190px",
                    objectFit: "cover"
                }}
            />

            <div style={{ padding: "15px" }}>

                <h3 style={{ color: "white" }}>
                    {movie.title}
                </h3>

            </div>

        </div>
    );

}

export default HoverPreview;