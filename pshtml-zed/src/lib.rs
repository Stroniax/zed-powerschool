use zed_extension_api as zed;

struct PowerSchoolExtension;

impl zed::Extension for PowerSchoolExtension {
    fn new() -> Self
    where
        Self: Sized,
    {
        PowerSchoolExtension
    }
}

zed::register_extension!(PowerSchoolExtension);
