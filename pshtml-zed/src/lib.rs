use zed_extension_api as zed;

struct PowerSchoolExtension;

impl zed::Extension for PowerSchoolExtension {
    fn new() -> Self
    where
        Self: Sized,
    {
        PowerSchoolExtension
    }

    fn language_server_command(
        &mut self,
        _language_server_id: &zed::LanguageServerId,
        _worktree: &zed::Worktree,
    ) -> zed_extension_api::Result<zed::Command> {
        Ok(zed::Command::new("cargo").args(["run", "-p", "pshtml-lsp"]))
    }
}

zed::register_extension!(PowerSchoolExtension);
