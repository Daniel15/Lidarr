using System.IO;
using NLog;
using NzbDrone.Common;
using NzbDrone.Common.Disk;
using NzbDrone.Common.EnvironmentInfo;
using NzbDrone.Common.Extensions;
using NzbDrone.Common.Http;
using NzbDrone.Common.Instrumentation.Extensions;
using NzbDrone.Core.Messaging.Commands;
using NzbDrone.Core.Plugins.Commands;

namespace NzbDrone.Core.Plugins
{
    public class InstallPluginService : IExecute<InstallPluginCommand>
    {
        private readonly IPluginService _pluginService;
        private readonly IDiskProvider _diskProvider;
        private readonly IAppFolderInfo _appFolderInfo;
        private readonly IHttpClient _httpClient;
        private readonly IArchiveService _archiveService;
        private readonly Logger _logger;

        public InstallPluginService(IPluginService pluginService,
                                    IDiskProvider diskProvider,
                                    IAppFolderInfo appFolderInfo,
                                    IHttpClient httpClient,
                                    IArchiveService archiveService,
                                    Logger logger)
        {
            _pluginService = pluginService;
            _diskProvider = diskProvider;
            _appFolderInfo = appFolderInfo;
            _httpClient = httpClient;
            _archiveService = archiveService;
            _logger = logger;
        }

        public void Execute(InstallPluginCommand message)
        {
            var package = _pluginService.GetRemotePlugin(message.GithubUrl);
            if (package != null)
            {
                InstallPlugin(package);
            }
        }

        private void InstallPlugin(RemotePlugin package)
        {
            EnsurePluginFolder();

            string tempFolder = TempFolder();
            if (_diskProvider.FolderExists(tempFolder))
            {
                _logger.Info("Deleting old plugin packages");
                _diskProvider.DeleteFolder(tempFolder, true);
            }

            var packageDestination = Path.Combine(tempFolder, $"{package.Name}.zip");

            _logger.ProgressInfo($"Downloading plugin {package.Name}");
            _httpClient.DownloadFile(package.PackageUrl, packageDestination);

            _logger.ProgressInfo("Extracting Plugin package");
            _archiveService.Extract(packageDestination, Path.Combine(PluginFolder(), package.Name));
            _logger.ProgressInfo($"Installed {package.Name}");
        }

        private void EnsurePluginFolder()
        {
            _diskProvider.EnsureFolder(PluginFolder());
        }

        private string PluginFolder()
        {
            return _appFolderInfo.GetPluginPath();
        }

        private string TempFolder()
        {
            return Path.Combine(_appFolderInfo.TempFolder, "plugins");
        }
    }
}
