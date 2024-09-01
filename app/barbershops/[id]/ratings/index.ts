// /app/barbershops/[id]/ratings/index.ts

export { default as RatingModal } from "../../../_components/rating-modal"
export { fetchServices, submitRating } from "./ratings-api"
export { useSubmitRating } from "./useRatings"
// Se você realmente precisa de useServices, descomente a linha abaixo
// export { useServices } from "./useRatings"
