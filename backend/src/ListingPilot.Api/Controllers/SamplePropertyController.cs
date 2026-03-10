using ListingPilot.Application.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace ListingPilot.Api.Controllers;

[ApiController]
[Route("api/sample-property")]
public class SamplePropertyController : ControllerBase
{
    [HttpGet]
    public ActionResult<PropertyInputDto> GetSampleProperty()
    {
        var sample = new PropertyInputDto
        {
            StreetAddress = "1847 Whisperwood Lane",
            City = "Tucker",
            State = "GA",
            Zip = "30084",
            Price = "$724,900",
            Beds = "4",
            Baths = "3.5",
            Sqft = "3,200",
            LotSize = "0.45 acres",
            PropertyType = "Single Family",
            YearBuilt = "2019",
            Neighborhood = "Whisperwood Estates",
            KeyFeatures = "New construction feel, smart home, three-car garage, finished basement",
            InteriorFeatures = "Quartz countertops, hardwood floors, chef's kitchen, spa master bath, open concept",
            ExteriorFeatures = "Professional landscaping, covered back porch, fire pit, irrigation system",
            SchoolInfo = "Tucker High School cluster, top-rated elementary",
            AgentNotes = "Motivated sellers, priced below appraisal, quick close possible",
            TargetBuyer = "Move-Up Buyers",
            Tone = "Professional"
        };

        return Ok(sample);
    }
}
