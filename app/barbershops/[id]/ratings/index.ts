// /app/barbershops/[id]/ratings/index.ts

export { default as RatingModal } from "../../../_components/rating-modal"
export { fetchServices, submitRating } from "./ratings-api"
export { useServices, useSubmitRating } from "./useRatings"
