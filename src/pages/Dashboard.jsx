const Dashboard = ({ icon, mainText, secondaryText }) => {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="text-brand-primary">{icon}</span>

        <span className="text-2xl font-semibold leading-none">{mainText}</span>
      </div>

      <p className="mt-2 text-sm text-brand-text-gray">{secondaryText}</p>
    </div>
  )
}

export default Dashboard
