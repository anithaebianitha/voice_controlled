"""Navigation helper for direction guidance text."""

from random import choice

NAV_OPTIONS = ["left", "right", "forward", "obstacle"]


def get_navigation_instruction() -> str:
    """Simulate navigation direction for user assistance."""
    return choice(NAV_OPTIONS)


def build_guidance_text(object_name: str, location: str) -> str:
    """Build user-friendly speech text."""
    mapping = {
        "left": f"{object_name.capitalize()} detected on your left",
        "right": f"{object_name.capitalize()} detected on your right",
        "front": f"{object_name.capitalize()} ahead",
        "forward": f"Move forward, {object_name} detected ahead",
        "obstacle": f"Obstacle warning: {object_name} in front",
    }
    return mapping.get(location, f"{object_name.capitalize()} detected nearby")
