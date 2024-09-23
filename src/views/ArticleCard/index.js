import React, { useState, useEffect } from "react";
import "./index.css";
import baseURL from "../../config";
import { formatDateTime } from "src/utils";
import Card from "src/components/commons/Card";

const ArticleCard = ({ article }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [botName, setBotName] = useState("");

  article = {
    ...article,
    image: `https://appnewsposters.s3.us-east-2.amazonaws.com/${article.image}`,
    title: article.title.slice(0, 100),
    content: article.content
      .replace("Here is the rewritten headline and summary of the article:", "")
      .slice(0, 250),
    date: formatDateTime(article.date),
  };

  if (article.reason) article.reason = `Reason: ${article.reason.trim()}`;
  if (article.is_article_efficent) {
    article.tagColor = article.is_article_efficent.split(" ")[0].toLowerCase();
    article.comment = article.is_article_efficent.split(" ").slice(1).join(" ");
  }

  useEffect(() => {
    const fetchBotName = async () => {
      try {
        const response = await fetch(`${baseURL.BOTS_V2_API}/bots`);
        if (response.ok) {
          const responseData = await response.json();
          if (responseData.success && Array.isArray(responseData.data)) {
            const bot = responseData.data.find(
              (bot) => bot.id === article.bot_id,
            );
            if (bot) {
              setBotName(bot.name);
            } else {
              console.error(`Bot with ID ${article.bot_id} not found`);
            }
          } else {
            console.error("Response data format is incorrect:", responseData);
          }
        } else {
          console.error("Failed to fetch bots");
        }
      } catch (error) {
        console.error("Error fetching bots:", error);
      }
    };

    if (article.bot_id) {
      fetchBotName();
    }
  }, [article.bot_id]);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = (e) => {
    e.stopPropagation();
    setModalOpen(false);
    setImageLoaded(false);
  };

  const handleImageLoaded = () => {
    setImageLoaded(true);
  };

  return (
    <>
      <Card
        data={article}
        onClick={openModal}
        onImgLoad={handleImageLoaded}
      />
      {modalOpen && (
        <div className={`modal ${imageLoaded ? "" : "loading"}`}>
          <div className="modal-content">
            <button className="close" onClick={closeModal}>
              &times;
            </button>
            {!imageLoaded && <div className="loader"></div>}
            <img
              className={`img-modal-news ${
                imageLoaded ? "img-modal-news-show" : "img-modal-news-hide"
              }`}
              src={article.image}
              onLoad={handleImageLoaded}
            />
            <h2>{article.title}</h2>
            <p>{article.date}</p>
            <p>{article.content}</p>
            <p>{article.is_article_efficent}</p>
          </div>
        </div>
      )}
    </>
  
 
    //   {article.reason && <p>{article.reason}</p>}
    //   <p>{filContent}</p>
    //   {article.comment && (
    //     <span style={{ paddingInline: 10 }}>{article.comment}</span>
    //   )}
    //   <div className="details-container">
    //     <span
    //       style={{
    //         display: "flex",
    //         alignItems: "center",
    //         gap: 5,
    //         fontSize: 14,
    //       }}
    //     >
    //       <AccessTime />
    //       <strong>{formatDateTime(article.date)}</strong>
    //     </span>
    //     <div className="tags-container">
    //       {article.is_top_story && (
    //         <span className="tag top-story">TOP STORY</span>
    //       )}
    //       {article.tagColor && (
    //         <div
    //           style={{
    //             height: 20,
    //             width: 20,
    //             borderRadius: "50%",
    //             background: article.tagColor,
    //           }}
    //         ></div>
    //       )}
    //     </div>
    //   </div>
    // </div>
  );
};

export default ArticleCard;
