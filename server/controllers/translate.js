import translate from "translate-google";

export const translateText = async (req, res) => {
  try {
    const { text, targetLanguage } = req.body;

    const translatedText = await translate(
      text,
      {
        to: targetLanguage || "en",
      }
    );

    res.status(200).json({
      success: true,
      translatedText,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};