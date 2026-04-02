"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";
import LiveBar from "../components/LiveBar";

export default function TipsPage() {
  const [selected, setSelected] = useState<number | null>(7);

  const numbers = Array.from({ length: 10 }, (_, i) => i);

  const voteData = [
    { num: 0, votes: 44, percent: 15.7 },
    { num: 1, votes: 40, percent: 14.2 },
    { num: 7, votes: 36, percent: 12.8 },
    { num: 4, votes: 30, percent: 10.7 },
    { num: 8, votes: 28, percent: 10.0 },
    { num: 6, votes: 26, percent: 9.3 },
    { num: 9, votes: 24, percent: 8.5 },
    { num: 3, votes: 19, percent: 6.8 },
    { num: 2, votes: 18, percent: 6.4 },
    { num: 5, votes: 16, percent: 5.7 },
  ];

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <LiveBar />

      {/* ================= TIPS TABLE ================= */}
      <div className="max-w-xl mx-auto mt-6 bg-white rounded shadow">
        <div className="grid grid-cols-2 bg-yellow-400 p-3 font-bold text-center">
          <div>Tip of the Day</div>
          <div>02-Apr-2026</div>
        </div>

        {[
          { label: "1 Bazi", val: "0,2,4,6,8", status: false },
          { label: "2 Bazi", val: "9,8,2,1,5", status: true },
          { label: "3 Bazi", val: "5,1,8,0,3", status: false },
          { label: "4 Bazi", val: "6,1,2,5,9", status: false },
          { label: "5 Bazi", val: "3,1,6,8,2", status: true },
          { label: "6 Bazi", val: "6,8,3,4,9" },
        ].map((item, i) => (
          <div key={i} className="grid grid-cols-2 border-t p-3 text-center">
            <div>
              {item.label}{" "}
              {item.status !== undefined && (
                <span>{item.status ? "✅" : "❌"}</span>
              )}
            </div>
            <div className="font-semibold">{item.val}</div>
          </div>
        ))}
      </div>

      {/* ================= VOTING ================= */}
      <div className="text-center mt-8">
        <h2 className="text-yellow-500 font-bold text-xl">
          VOTE: BEST PREDICTION (0-9)
        </h2>

        <div className="flex flex-wrap justify-center gap-3 mt-4">
          {numbers.map((num) => (
            <button
              key={num}
              onClick={() => setSelected(num)}
              className={`w-12 h-12 rounded-full shadow 
              ${selected === num ? "bg-yellow-400" : "bg-white"}`}
            >
              {num}
            </button>
          ))}
        </div>

        <button className="mt-4 bg-gray-300 px-10 py-2 rounded font-bold">
          VOTE CASTED
        </button>

        <p className="text-green-600 mt-2 text-sm">
          ✅ You have already voted.
        </p>
      </div>

      {/* ================= LIVE RESULTS ================= */}
      <div className="max-w-xl mx-auto mt-6 bg-white p-4 rounded shadow">
        <h2 className="text-yellow-500 font-bold text-center mb-4">
          LIVE VOTE RESULTS
        </h2>

        {voteData.map((item, i) => (
          <div key={i} className="mb-3">
            <div className="flex justify-between text-sm mb-1">
              <span className="bg-yellow-400 px-2 rounded-full">
                {item.num}
              </span>
              <span>{item.votes} Votes</span>
              <span>{item.percent}%</span>
            </div>

            <div className="w-full bg-gray-200 h-2 rounded">
              <div
                className="bg-green-500 h-2 rounded"
                style={{ width: `${item.percent}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* ================= CONTENT SECTION ================= */}
      <div className="max-w-3xl mx-auto mt-6 bg-white rounded-lg shadow p-5">
        {/* TITLE 1 */}
        <h2 className="text-purple-700 font-bold text-lg border-b-2 border-yellow-400 pb-1">
          Kolkata FF is a very popular game
        </h2>

        <p className="text-gray-700 mt-3 text-sm leading-6">
          Kolkata FF is a very popular game that many people play daily. In this
          game, players guess numbers, and if the guessed number is correct,
          they win. We provide daily tips for Kolkata FF based on common guesses
          from different players. But remember one important thing: these are
          just tips, not a guarantee. We provide tips eight times a day, with
          each tip containing five numbers. These tips are shared to assist
          players in making more informed decisions, but it’s important to note
          that they are not a guarantee of winning, as the game is based on
          chance.
        </p>

        {/* TITLE 2 */}
        <h2 className="text-purple-700 font-bold text-lg mt-6 border-b-2 border-yellow-400 pb-1">
          Our Role
        </h2>

        <p className="text-gray-700 mt-3 text-sm leading-6">
          We offer daily Kolkata FF tips derived from analyses of predictions
          made by various players. Our team gathers insights from multiple
          sources, identifying numbers that are frequently chosen. After
          thorough evaluation, we share these numbers as “tips” to assist
          players in making informed decisions. It’s crucial to understand that
          we provide informational content, not assurances of winning. Our tips
          are curated based on observed patterns and trends. However, given the
          unpredictable nature of the game, we cannot guarantee success with
          every prediction.
        </p>

        {/* TITLE 3 */}
        <h2 className="text-purple-700 font-bold text-lg mt-6 border-b-2 border-yellow-400 pb-1">
          Play Responsibly: Understand the Risks
        </h2>

        <p className="text-gray-700 mt-3 text-sm leading-6">
          We emphasize the importance of playing at your own risk. The tips we
          provide are based on observations and experience, but they do not
          ensure victory. Kolkata FF is inherently a game of chance, and
          outcomes can never be predicted with absolute certainty. Participation
          in the game is entirely your decision. Whether you win or lose depends
          on various factors, including your choices and strategies. We do not
          encourage or discourage participation; we merely provide information
          to aid your understanding.
        </p>

        <h2 className="text-purple-700 font-bold text-lg mt-6 border-b-2 border-yellow-400 pb-1">
          Disclaimer: No Liability for Outcomes
        </h2>

        <p className="text-gray-700 mt-3 text-sm leading-6">
          It’s essential to recognize that we are not responsible for any gains
          or losses incurred while playing Kolkata FF. Our role is to share
          insights and information; the decisions you make based on this
          information are solely your responsibility. If you achieve success,
          the credit is yours. Conversely, if you face losses, it’s a part of
          the game’s inherent risk. We urge all players to approach the game
          with caution and awareness.
        </p>

        <h2 className="text-purple-700 font-bold text-lg mt-6 border-b-2 border-yellow-400 pb-1">
          Methodology: How We Curate Our Tips
        </h2>

        <p className="text-gray-700 mt-3 text-sm leading-6">
          Data Collection: We monitor predictions from experienced Kolkata FF
          players and groups. Analysis: We identify common numbers, study past
          results, and observe patterns. Tip Selection: Based on our analysis,
          we select numbers that appear more likely to emerge.
        </p>

        <h2 className="text-purple-700 font-bold text-lg mt-6 border-b-2 border-yellow-400 pb-1">
          Stay Updated: Accessing Results and Tips
        </h2>

        <p className="text-gray-700 mt-3 text-sm leading-6">
          We maintain an official website where you can promptly access Kolkata
          FF results and tips. Our platform is regularly updated with accurate
          and verified information, ensuring you stay informed and make timely
          decisions. By relying on our website, you can avoid delays and
          inaccuracies that may arise from unofficial sources.
        </p>

        <h2 className="text-purple-700 font-bold text-lg mt-6 border-b-2 border-yellow-400 pb-1">
          Understanding Kolkata FF: A Brief Overview
        </h2>

        <p className="text-gray-700 mt-3 text-sm leading-6">
          Gameplay: Players predict numbers in multiple rounds held throughout
          the day. Number Selection: Numbers range from 0 to 9, and players can
          choose single or multiple numbers. Results: Winning numbers are
          announced after each round, and players with correct predictions
          receive payouts.
        </p>

        <h2 className="text-purple-700 font-bold text-lg mt-6 border-b-2 border-yellow-400 pb-1">
          Tips: Enhancing Your Gameplay
        </h2>

        <p className="text-gray-700 mt-3 text-sm leading-6">
          Pattern Recognition: Study past results to identify recurring numbers
          or sequences. Budget Management: Set a budget for your gameplay and
          adhere to it strictly. Avoid Chasing Losses: If you experience losses,
          resist the urge to increase your bets to recover them. Stay Informed:
          Regularly check our website for updated tips and results. Play
          Responsibly: Remember that it’s a game of chance; play for
          entertainment, not as a source of income.
        </p>

        <h2 className="text-purple-700 font-bold text-lg mt-6 border-b-2 border-yellow-400 pb-1">
          A Word of Caution: Legal Considerations
        </h2>

        <p className="text-gray-700 mt-3 text-sm leading-6">
          It’s important to note that gambling laws vary across regions. While
          Kolkata FF is popular in certain areas, it may not be legally
          permitted everywhere. Ensure you are aware of and comply with local
          laws and regulations before participating in the game.
        </p>

        <h2 className="text-purple-700 font-bold text-lg mt-6 border-b-2 border-yellow-400 pb-1">
          Final Thoughts: Enjoy the Game Responsibly
        </h2>

        <p className="text-gray-700 mt-3 text-sm leading-6">
          Kolkata FF offers excitement and the thrill of prediction. However,
          it’s crucial to approach the game with a clear understanding of its
          nature and risks. Utilize our tips as a resource to inform your
          decisions, but always play responsibly and within your means.
          Remember, our goal is to provide information to enhance your
          understanding and enjoyment of the game. The choices you make and the
          outcomes you experience are ultimately in your hands.
        </p>
      </div>
    </div>
  );
}
