"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const FacultyPublicationsChart = () => {
  const [publicationCounts, setPublicationCounts] = useState({
    Book: 0,
    "Book Chapter": 0,
    "Journal Article": 0,
    Patent: 0,
    // "Conference Paper": 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      const endpointMap = {
        Book: `http://localhost:6005/api/v1/book/book/`,
        "Book Chapter": `http://localhost:6005/api/v1/chapter/chapter/`,
        "Journal Article": `http://localhost:6005/api/v1/journals/journal/`,
        Patent: `http://localhost:6005/api/v1/patents/patent/get`,
        // "Conference Paper": `http://localhost:6005/api/v1/conferences/conference/get`,
      };

      try {
        const adminAccessToken = sessionStorage.getItem("teacherAccessToken");

        const results = await Promise.all(
          Object.entries(endpointMap).map(async ([key, url]) => {
            try {
              const response = await axios.get(url, {
                headers: {
                  Authorization: `Bearer ${adminAccessToken}`,
                },
              });
              // console.log(response.data);
              return [
                key,
                Array.isArray(response.data.data)
                  ? response.data.data.length
                  : 0,
              ];
            } catch (error) {
              console.error(`Error fetching ${key} data:`, error);
              return [key, 0];
            }
          })
        );

        const counts = results.reduce((acc, [key, count]) => {
          acc[key] = count;
          return acc;
        }, {});

        setPublicationCounts(counts);

        // Debugging Output
        console.log("Fetched Publication Counts:", counts);
      } catch (error) {
        console.error("Error fetching publication data:", error);
      }
    };

    fetchData();
  }, []);

  const totalPublications = Object.values(publicationCounts).reduce(
    (a, b) => a + b,
    0
  );

  const colorMap = {
    Book: "#1E90FF", // Blue - Represents trust and knowledge
    "Book Chapter": "#FFD700", // Gold - Denotes value and importance
    "Journal Article": "#32CD32", // Green - Reflects growth and progress
    Patent: "#FF4500", // Red-Orange - Suggests innovation and creativity
    "Conference Paper": "#9370DB", // Purple - Indicates professionalism and prestige
  };

  const chartData = {
    labels: Object.keys(publicationCounts),
    datasets: [
      {
        data: Object.values(publicationCounts),
        backgroundColor: Object.keys(publicationCounts).map(
          (key) => colorMap[key]
        ),
        borderColor: "#ffffff",
        borderWidth: 2,
      },
    ],
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg bg-gradient-to-br from-gray-50 to-white">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-extrabold text-gray-800">
          Teacher Publications Overview
        </CardTitle>
        <CardDescription className="text-gray-600">
          Insights into publication distribution by type
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="h-[400px] w-full mb-8">
          <Pie
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                tooltip: {
                  callbacks: {
                    label: (tooltipItem) => {
                      const value = tooltipItem.raw;
                      const percentage = (
                        (value / totalPublications) *
                        100
                      ).toFixed(2);
                      return `${tooltipItem.label}: ${value} (${percentage}%)`;
                    },
                  },
                },
                legend: {
                  display: true,
                  position: "bottom",
                },
              },
            }}
          />
        </div>
        <div className="w-full">
          <h3 className="text-xl font-bold text-gray-700 mb-4">
            Detailed Publication Counts
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {Object.entries(publicationCounts).map(([type, count]) => (
              <div
                key={type}
                className="flex items-center p-4 bg-gray-100 rounded-lg shadow-sm"
              >
                <div
                  className="w-4 h-4 rounded-full mr-3"
                  style={{
                    backgroundColor: colorMap[type],
                  }}
                ></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600">{type}</p>
                  <p className="text-lg font-semibold text-gray-800">{count}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-6 text-lg font-bold text-gray-800 text-center">
            Total Publications: {totalPublications}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FacultyPublicationsChart;
