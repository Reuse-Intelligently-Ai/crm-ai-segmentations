import {
  HeartIcon,
  StarIcon,
  CodeBracketIcon,
  UserGroupIcon,
  GlobeAltIcon,
  DocumentTextIcon,
} from "@heroicons/react/20/solid";

// Type untuk contributor data
type Contributor = {
  id: number;
  name: string;
  username: string;
  avatar?: string;
  contributions: number;
  role?: string;
};

// Sample contributors data - ganti dengan data real dari GitHub API
const contributors: Contributor[] = [
  {
    id: 1,
    name: "BlackHat",
    username: "yogithesymbian",
    contributions: 47,
    role: "Maintainer",
    avatar: "https://avatars.githubusercontent.com/u/yogithesymbian", // placeholder
  },
  // Tambahkan contributor lain jika ada
  // {
  //   id: 2,
  //   name: "Contributor Name",
  //   username: "contributor-username",
  //   contributions: 12,
  //   role: "Contributor"
  // }
];

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const repoUrl =
    "https://github.com/Reuse-Intelligently-Ai/crm-ai-segmentations";

  return (
    <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Project Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <CodeBracketIcon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold">CRM AI Segmentation</h3>
            </div>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Ini adalah uji coba integrasi API Gemini Pro yang fokus pada
              kompatibilitas lintas platform. Fiturnya adalah pemrosesan data
              dan validasi teknis/kinerja API. (100% Gemini AI, namun footer ini
              dari Claude AI.)
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 bg-blue-600/20 text-blue-300 rounded-full text-sm font-medium">
                React
              </span>
              <span className="px-3 py-1 bg-purple-600/20 text-purple-300 rounded-full text-sm font-medium">
                AI/ML
              </span>
              <span className="px-3 py-1 bg-green-600/20 text-green-300 rounded-full text-sm font-medium">
                TypeScript
              </span>
              <span className="px-3 py-1 bg-yellow-600/20 text-yellow-300 rounded-full text-sm font-medium">
                Next.js
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <GlobeAltIcon className="h-5 w-5 text-blue-400" />
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href={repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors flex items-center gap-2"
                >
                  <CodeBracketIcon className="h-4 w-4" />
                  Source Code
                </a>
              </li>
              <li>
                <a
                  href={`${repoUrl}/issues`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors flex items-center gap-2"
                >
                  <DocumentTextIcon className="h-4 w-4" />
                  Issues & Bugs
                </a>
              </li>
              <li>
                <a
                  href={`${repoUrl}/blob/main/README.md`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors flex items-center gap-2"
                >
                  <DocumentTextIcon className="h-4 w-4" />
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href={`${repoUrl}/releases`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors flex items-center gap-2"
                >
                  <StarIcon className="h-4 w-4" />
                  Releases
                </a>
              </li>
            </ul>
          </div>

          {/* Contributors */}
          <div>
            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <UserGroupIcon className="h-5 w-5 text-purple-400" />
              Contributors
            </h4>
            {contributors.length > 0 ? (
              <div className="space-y-3">
                {contributors.map((contributor) => (
                  <div key={contributor.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {contributor.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <a
                        href={`https://github.com/${contributor.username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white hover:text-blue-300 transition-colors font-medium truncate block"
                      >
                        {contributor.name}
                      </a>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <span>{contributor.contributions} commits</span>
                        {contributor.role && (
                          <span className="px-2 py-0.5 bg-blue-600/30 text-blue-300 rounded">
                            {contributor.role}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <a
                  href={`${repoUrl}/graphs/contributors`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                  View all contributors →
                </a>
              </div>
            ) : (
              <div className="text-gray-400 text-sm">
                <p className="mb-2">Jadilah contributor pertama!</p>
                <a
                  href={`${repoUrl}/fork`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Fork & Contribute →
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-8 pt-8 border-t border-gray-700">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-800/50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">AI-Powered</div>
              <div className="text-sm text-gray-400">Smart Segmentation</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-400">
                Drag & Drop
              </div>
              <div className="text-sm text-gray-400">Easy to Use</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-400">
                Open Source
              </div>
              <div className="text-sm text-gray-400">MIT License</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400">Modern</div>
              <div className="text-sm text-gray-400">React + TypeScript</div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-8 pt-8 border-t border-gray-700">
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl p-6 text-center border border-blue-500/20">
            <h3 className="text-xl font-bold mb-2">Love this project? ⭐</h3>
            <p className="text-gray-300 mb-4">
              Star our repository dan contribute untuk membantu pengembangan!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg font-semibold transition-all"
              >
                <StarIcon className="h-5 w-5" />
                Star on GitHub
              </a>
              <a
                href={`${repoUrl}/fork`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 rounded-lg font-semibold transition-all"
              >
                <CodeBracketIcon className="h-5 w-5" />
                Fork & Contribute
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-gray-400">
              <span>© {currentYear} CRM AI Segmentation.</span>
              <span>Made with</span>
              <HeartIcon className="h-4 w-4 text-red-500" />
              <span>by</span>
              <a
                href="https://github.com/yogithesymbian"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
              >
                yogithesymbian
              </a>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <a
                href={`${repoUrl}/blob/main/LICENSE`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                MIT License
              </a>
              <span>•</span>
              <a
                href={`${repoUrl}/releases`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                v1.0.0
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
