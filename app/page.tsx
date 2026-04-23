import Link from "next/link";
import Header from "../components/layout/Header";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <Header />
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Добро пожаловать
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Интерактивная карта с маркерами
          </p>
          <Link
            href="/maps"
            className="inline-block px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
          >
            Перейти к карте
          </Link>
        </div>
      </main>
    </div>
  );
}
