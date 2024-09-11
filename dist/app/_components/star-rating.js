import React from "react";
import { Star } from "lucide-react"; // Assumindo que você está usando lucide-react para ícones
export const StarRating = ({ rating }) => {
    return (<div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (<Star key={star} className={star <= rating ? "text-yellow-400" : "text-gray-300"} fill={star <= rating ? "currentColor" : "none"}/>))}
    </div>);
};
