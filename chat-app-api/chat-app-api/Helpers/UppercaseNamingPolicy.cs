using System.Text.Json;

namespace chat_app_api.Helpers
{
    public class UppercaseNamingPolicy : JsonNamingPolicy
    {
        public override string ConvertName(string name)
        {
            return name.ToUpper();
        }
    }
}
