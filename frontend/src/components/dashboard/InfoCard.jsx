
const InfoCard = ({ imageSrc, title, description, onClick }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col hover:shadow-xl transition-all duration-300 h-full hover:scale-105 cursor-pointer">
      <div className="h-48 w-full bg-gray-200 overflow-hidden">
        {imageSrc ? (
          <img src={imageSrc || "/placeholder.svg"} alt={title} className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-gray-400 text-sm">No Image</div>
        )}
      </div>
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-lg font-bold mb-3 text-gray-900 line-clamp-2">{title}</h3>
        <p className="text-sm text-gray-600 leading-relaxed flex-1 line-clamp-3">{description}</p>
        <div className="mt-4">
          <button
            onClick={onClick}
            className="w-full px-5 py-2 rounded-full text-sm font-medium bg-cyan-600 hover:bg-cyan-700 text-white transition-colors duration-200"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  )
}

export default InfoCard
