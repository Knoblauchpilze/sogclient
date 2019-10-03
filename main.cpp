
# include <core_utils/StdLogger.hh>
# include <core_utils/LoggerLocator.hh>

# include <sdl_app_core/SdlApplication.hh>
# include <core_utils/CoreException.hh>
# include <sdl_core/SdlWidget.hh>

int main(int argc, char* argv[]) {
  // Create the logger.
  utils::StdLogger logger;
  utils::LoggerLocator::provide(&logger);

  const std::string service("client");
  const std::string module("main");

  // Create the application window parameters.
  const std::string appName = std::string("sogclient");
  const std::string appTitle = std::string("Mining is not the way to the top 1 ya know");
  const std::string appIcon = std::string("data/img/65px-Stop_hand.BMP");
  const utils::Sizei size(640, 480);

  sdl::app::SdlApplicationShPtr app = nullptr;

  try {
    app = std::make_shared<sdl::app::SdlApplication>(appName, appTitle, appIcon, size, true, 50.0f, 60.0f);

    // `root_widget`
    sdl::core::SdlWidget* root_widget = new sdl::core::SdlWidget(std::string("root_widget"));
    app->setCentralWidget(root_widget);

    // Run it.
    app->run();
  }
  catch (const utils::CoreException& e) {
    utils::LoggerLocator::getLogger().logMessage(
      utils::Level::Critical,
      std::string("Caught internal exception while setting up application"),
      module,
      service,
      e.what()
    );
  }
  catch (const std::exception& e) {
    utils::LoggerLocator::getLogger().logMessage(
      utils::Level::Critical,
      std::string("Caught exception while setting up application"),
      module,
      service,
      e.what()
    );
  }
  catch (...) {
    utils::LoggerLocator::getLogger().logMessage(
      utils::Level::Critical,
      std::string("Unexpected error while setting up application"),
      module,
      service
    );
  }

  app.reset();

  // All is good.
  return EXIT_SUCCESS;
}
