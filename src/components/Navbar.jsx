function Navbar() {
  return (
    <nav className="bg-slate-900 shadow-lg">

      <div className="max-w-[1700px] mx-auto px-8 h-20 flex justify-between items-center">

        <h1 className="text-4xl font-bold text-yellow-400">
            🎬 MovieDB
        </h1>

        <ul className="flex gap-10 text-lg font-semibold text-white">

          <li className="cursor-pointer hover:text-yellow-400">
            Browse
          </li>

          <li className="cursor-pointer hover:text-yellow-400">
            Watchlist
          </li>

          <li className="cursor-pointer hover:text-yellow-400">
            Add Movie
          </li>

        </ul>

      </div>

    </nav>
  );
}

export default Navbar;