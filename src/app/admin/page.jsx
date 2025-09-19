export default function AdminPanel() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Panel</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Dashboard Cards */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Bookings</h2>
            <p className="text-gray-600">Manage taxi bookings</p>
            <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              View Bookings
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Users</h2>
            <p className="text-gray-600">Manage user accounts</p>
            <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
              View Users
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Routes</h2>
            <p className="text-gray-600">Manage available routes</p>
            <button className="mt-4 bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
              View Routes
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Contacts</h2>
            <p className="text-gray-600">View contact form submissions</p>
            <a href="/admin/contacts" className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 inline-block">
              View Contacts
            </a>
          </div>
        </div>

        {/* Placeholder for future admin features */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Analytics</h2>
          <p className="text-gray-600">Coming soon: View booking analytics and reports</p>
        </div>
      </div>
    </div>
  )
}
